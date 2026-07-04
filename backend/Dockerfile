# 1. Use the official .NET SDK image for .NET 10.0 to build the application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build-env
WORKDIR /app

# 2. Copy the project file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# 3. Copy the remaining backend files and build the release
COPY . ./
RUN dotnet publish -c Release -o out

# 4. Build the final .NET 10.0 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build-env /app/out .

# 5. Tell .NET to listen on the dynamic port Render provides
ENV ASPNETCORE_URLS=http://*:${PORT}

# 6. Run the API (Ensure this matches your actual .csproj name)
ENTRYPOINT ["dotnet", "SecondHandCarSelling.dll"]
