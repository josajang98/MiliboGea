package com.ssafy.backend.common.auth;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;

import com.ssafy.backend.common.util.JwtTokenUtil;
import com.ssafy.backend.common.util.ResponseBodyWriteUtil;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.service.UserService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

public class JwtAuthenticationFilter extends BasicAuthenticationFilter {
    private UserService userService;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, UserService userService) {
        super(authenticationManager);
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Read the Authorization header, where the JWT Token should be
        String header = request.getHeader(JwtTokenUtil.HEADER_STRING);

        // If header does not contain BEARER or is null delegate to Spring impl and exit
        if (header == null || !header.startsWith(JwtTokenUtil.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // If header is present, try grab user principal from database and perform authorization
            Authentication authentication = getAuthentication(request);
            // jwt ???????????? ?????? ????????? ?????? ??????(authentication) ??????.
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception ex) {
            ResponseBodyWriteUtil.sendError(request, response, ex);
            return;
        }

        filterChain.doFilter(request, response);
    }

    @Transactional(readOnly = true)
    public Authentication getAuthentication(HttpServletRequest request) throws Exception {
        String token = request.getHeader(JwtTokenUtil.HEADER_STRING);
        // ?????? ????????? Authorization ????????? jwt ????????? ????????? ????????????, ?????? ?????? ??? ?????? ?????? ?????? ??????.
        if (token != null) {
            // parse the token and validate it (decode)
            JWTVerifier verifier = JwtTokenUtil.getVerifier();
            JwtTokenUtil.handleError(token);
            logger.info(token.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
            DecodedJWT decodedJWT = verifier.verify(token.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
            String userId = decodedJWT.getSubject();

            // Search in the DB if we find the user by token subject (username)
            // If so, then grab user details and create spring auth token using username, pass, authorities/roles
            if (userId != null) {
                // jwt ????????? ????????? ?????? ??????(userId) ?????? ?????? ????????? ?????? ????????? ????????? ????????? ??????.
                Optional<User> appUserOptional = userService.getUserByEmail(userId);
                if(appUserOptional.isPresent()) {
                    // ????????? ?????? ????????? ??????, ?????? context ????????? ?????? ????????? ?????? ??????(jwtAuthentication) ??????.
                    AppUserDetails appUserDetails = new AppUserDetails(appUserOptional.get());
                    UsernamePasswordAuthenticationToken jwtAuthentication = new UsernamePasswordAuthenticationToken(userId,
                            null, appUserDetails.getAuthorities());
                    jwtAuthentication.setDetails(appUserDetails);
                    return jwtAuthentication;
                }
            }
            return null;
        }
        return null;
    }
}

