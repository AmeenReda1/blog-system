import { UserType } from "src/modules/user/entities/user.entity";

export const LoginUserResponse = {
    message: 'User logged in successfully',
    data: {
        user: {
            id: '1',
            email: 'test@gmail.com',
            firstName: 'John',
            lastName: 'Doe',
            userType: UserType.EDITOR,
            mobileNumber: '01234567890',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        token: 'jwttokenhashedasdfghjkl',
    }
}