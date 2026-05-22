package com.step.hotel.service;

import com.step.hotel.exceptions.NotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class UserDetailService implements UserDetailsService {
    private final UserService userService;

    public UserDetailService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        boolean userExist = userService.isUserExist(userId);
        if (!userExist) throw new NotFoundException(String.format("User not found with userId %s", userId));
        return User.builder().roles("USER").username(userId).build();
    }
}
