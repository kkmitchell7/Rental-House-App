from django.shortcuts import render

from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from rest_framework import status
from .serializers import *
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken


class AuthApiView(APIView):
    serializer_class=UserSerializer
    def get(self,request, id=None):
        if id is not None:
            try:
                user = User.objects.get(pk=id)
                serializer = UserSerializer(user)
                return Response({"Message":"Returned user by id.", "User":serializer.data})
            except User.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            allUsers = User.objects.all().values()
            serializer = UserSerializer(allUsers, many=True)
            return Response({"Message":"Returned all users.", "Users":serializer.data})
    def put(self,request, id):
        try:
            user = User.objects.get(pk=id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"Message":"User updated successfully by id", "User":serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginApiView(APIView):
    serializer_class=LoginSerializer
    def post(self,request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            #need to do hashing here so that only store hashed passwords
            password = serializer.validated_data['password']

            # Check if user exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'message': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Verify password
            if not user.check_password(password):
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

            # Generate token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            res_user = {
                'id': user.id,
                'email': user.email,
                'token': access_token,
                'firstName': user.first_name,
                'lastName': user.last_name
            }

            return Response({'message': 'Login successful!', 'data': res_user}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterApiView(APIView):
    serializer_class=UserSerializer
    def post (self,request):
        data = request.data
        required_fields = ['first_name', 'last_name', 'email', 'password']

        # Check if all required fields are present
        for field in required_fields:
            if field not in data:
                return Response({'message': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if email already exists
        if User.objects.filter(email=data['email']).exists():
            return Response({'message': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize and validate data
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            # Save the new user
            user = serializer.save()
            print(type(user))


            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            res_user = {
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'token': access_token
            }

            return Response({'message': 'New user created!', 'data': res_user}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
