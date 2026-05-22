package com.step.hotel.mongoServiceImple;

import com.step.hotel.exceptions.BadRequestException;
import com.step.hotel.model.User;
import com.step.hotel.repository.UserMongoRepo;
import com.step.hotel.service.JwtService;
import com.step.hotel.service.UserService;
import com.step.hotel.views.UserLoginResponseView;
import com.step.hotel.views.UserRequestView;
import com.step.hotel.views.UserResponseView;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserServiceImpl implements UserService {
    private final UserMongoRepo userMongoRepo;
    private final JwtService jwtService;

    public UserServiceImpl(UserMongoRepo userMongoRepo, JwtService jwtService) {
        this.userMongoRepo = userMongoRepo;
        this.jwtService = jwtService;
    }

    @Override
    public boolean isUserExist(String userId) {
        Optional<User> user = userMongoRepo.findById(userId);
        return user.isPresent();
    }

    @Override
    public UserResponseView createUser(UserRequestView userRequestView) {
        User user = userMongoRepo.findByUsername(userRequestView.username());
        if (user != null) {
            throw new BadRequestException("user already exists");
        }

        User newUser = new User(userRequestView.username(), userRequestView.password());
        return userMongoRepo.save(newUser).toResponse();
    }

    @Override
    public UserLoginResponseView loginUser(UserRequestView userRequestView) {
        User user = userMongoRepo.findByUsername(userRequestView.username());

        if (user == null) {
            throw new BadRequestException(String.format("user not found : %s", userRequestView.username()));
        }

        String token = jwtService.generateToken(user.toResponse().id());
        return user.toLoginResponse(token);
    }


}
