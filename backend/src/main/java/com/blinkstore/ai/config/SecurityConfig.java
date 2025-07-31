package com.blinkstore.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
// import java.util.stream.Collectors; // <-- THIS LINE HAS BEEN REMOVED
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.GET, "/api/v1/products").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/ai/chat").permitAll()
                .requestMatchers("/api/v1/admin/**").hasAuthority("ROLE_admin") // This rule is correct
                .anyRequest().authenticated()
            )
            // This part is crucial. It tells Spring Security to use our custom JWT converter.
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));

        return http.build();
    }

    // This custom converter is the key to the fix. It tells Spring Security
    // exactly how to find the user's role inside the complex Clerk JWT.
    private Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        // We provide our custom converter class that knows where Clerk stores metadata.
        jwtConverter.setJwtGrantedAuthoritiesConverter(new ClerkRoleConverter());
        return jwtConverter;
    }

    // This class correctly extracts the 'role' from Clerk's 'public_metadata'.
    public static class ClerkRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
        @Override
        public Collection<GrantedAuthority> convert(Jwt jwt) {
            // Clerk nests all custom data inside a 'public_metadata' claim.
            final Map<String, Object> publicMetadata = jwt.getClaim("public_metadata");

            if (publicMetadata != null && publicMetadata.containsKey("role")) {
                String role = (String) publicMetadata.get("role");
                // Spring Security requires roles to have the "ROLE_" prefix.
                return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
            }
            // If no role is found, return an empty list.
            return Collections.emptyList();
        }
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}