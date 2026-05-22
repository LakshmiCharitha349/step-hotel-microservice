package com.step.hotel.model;

import com.step.hotel.views.UserLoginResponseView;
import com.step.hotel.views.UserResponseView;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    private final String username;
    private final String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public UserResponseView toResponse() {
        return new UserResponseView(id, username);
    }

    public UserLoginResponseView toLoginResponse(String token) {
        return new UserLoginResponseView(token, toResponse());
    }
}
