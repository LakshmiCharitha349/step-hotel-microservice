package com.step.hotel.service;

import com.step.hotel.views.UserLoginResponseView;
import com.step.hotel.views.UserRequestView;
import com.step.hotel.views.UserResponseView;

public interface UserService {
    boolean isUserExist(String username);


    UserResponseView createUser(UserRequestView userRequestView);

    UserLoginResponseView loginUser(UserRequestView userRequestView);
}
