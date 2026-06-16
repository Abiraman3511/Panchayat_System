# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["PanchayatApp.csproj", "./"]
RUN dotnet restore "./PanchayatApp.csproj"

# Copy the rest of the code and build
COPY . .
WORKDIR "/src/."
RUN dotnet publish "PanchayatApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build the final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

COPY --from=build /app/publish .

# Start the application
ENTRYPOINT ["dotnet", "PanchayatApp.dll"]
