FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build
WORKDIR /build
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0 AS final
EXPOSE 5000
ENV ASPNETCORE_URLS http://*:5000
WORKDIR /app
COPY --from=build /build/out .
ENTRYPOINT ["dotnet", "api-gateway.dll"]