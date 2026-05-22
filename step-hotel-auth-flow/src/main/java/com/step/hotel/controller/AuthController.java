package com.step.hotel.controller;

import com.step.hotel.service.UserService;
import com.step.hotel.views.UserLoginResponseView;
import com.step.hotel.views.UserRequestView;
import com.step.hotel.views.UserResponseView;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/users")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseView> signup(@RequestBody UserRequestView userRequestView) {
        UserResponseView user = userService.createUser(userRequestView);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseView> login(@RequestBody UserRequestView userRequestView) {
        UserLoginResponseView response = userService.loginUser(userRequestView);
        return ResponseEntity.ok(response);
    }
}
