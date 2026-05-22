package com.step.hotel.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class MyLogger implements Filter {
    private final Logger logger = LoggerFactory.getLogger("RequestLogger");

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        logger.info("{} {}", httpServletRequest.getMethod(), httpServletRequest.getRequestURI());
        chain.doFilter(request, response);
        logger.info("Response {}", httpServletResponse.getStatus());
    }
}
