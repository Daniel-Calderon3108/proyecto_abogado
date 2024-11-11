package com.example.proyecto_abogado.config;

import com.example.proyecto_abogado.services.user.UserService;
import com.example.proyecto_abogado.utils.JwtUtil;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        // Verificamos si la solicitud es al login
        if (request.getRequestURI().equals("/api/user/login")) {
            chain.doFilter(request, response);  // Permitimos que la solicitud al login pase sin validación de token
            return;
        }
        if (request.getRequestURI().equals("/api/user/searchPhoto/**")) {
            chain.doFilter(request, response);  // Permitimos que la solicitud al login pase sin validación de token
            return;
        }

        // Verificamos si la cabecera Authorization contiene un token JWT
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Extraemos el JWT de la cabecera
            try {
                // Extraemos el nombre de usuario del JWT
                username = jwtUtil.getValue(jwt);

            } catch (JwtException e) {
                // Si el token no es válido o ha expirado, respondemos con un código 403 Forbidden
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Token JWT invalido o expirado.");
                return;  // No continuar con el procesamiento
            }
        } else {
            // Si no se envía un token, respondemos con un código 401 Unauthorized
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token JWT requerido.");
            return;  // No continuar con el procesamiento
        }

        // Si el token es válido y el nombre de usuario se extrajo con éxito
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwt, username)) {
                // Cargamos los detalles del usuario
                UserDetails userDetails = userService.loadUserByUsername(username);
                if (userDetails != null) {
                    // Creamos el objeto de autenticación para el contexto de seguridad
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        // Continuamos con el procesamiento de la solicitud
        chain.doFilter(request, response);
    }
}