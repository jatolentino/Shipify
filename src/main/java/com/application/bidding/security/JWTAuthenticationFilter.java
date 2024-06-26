package com.application.auction.security;

import com.application.auction.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.application.auction.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.application.auction.security.SecurityConstants.EXPIRATION_TIME;
import static com.application.auction.security.SecurityConstants.HEADER_STRING;
import static com.application.auction.security.SecurityConstants.SECRET;
import static com.application.auction.security.SecurityConstants.TOKEN_PREFIX;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private AuthenticationManager authenticationManager;
    private UserService userService;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req,
                                                HttpServletResponse res) throws AuthenticationException {
        try {
            User creds = new ObjectMapper()
                    .readValue(req.getInputStream(), User.class);

            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getUserEmail(),           // here
                            creds.getUserPassword(),        // here
                            new ArrayList<>())
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    protected void successfulAuthentication(HttpServletRequest req,
                                            HttpServletResponse res,
                                            FilterChain chain,
                                            Authentication auth) throws IOException, ServletException {

        String token = Jwts.builder()                                                           // but not here
                .setSubject(((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET.getBytes())
                .compact();

        res.addHeader(HEADER_STRING, TOKEN_PREFIX + token);
        User user = userService.findbyEmail(((org.springframework.security.core.userdetails.User)
                auth.getPrincipal()).getUsername());
        //res.addHeader("userId", user.getUserId().toString());

        res.setContentType("application/json");
        res.setCharacterEncoding("utf-8");
        user.setUserPassword(TOKEN_PREFIX + token);

        PrintWriter out = res.getWriter();
//        StringBuilder builder = new StringBuilder();
//        builder.append(user.getUserId().toString());
//        builder.append(" ");
//
//        // get all items subscribed by user
//        List<Long> itemIds = userService.favorites(user.getUserId());
//        for (Long id : itemIds){
//            builder.append(id.toString());
//            builder.append(" ");
//        }
//
//        out.print(new StringResponse(builder.toString()));

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(out, user);
//        out.print(new StringResponse(user.getUserId().toString()).toString());
    }
}
