FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

COPY ./MyMusicApp.sln ./
COPY ./AuthLayer/AuthLayer.csproj ./AuthLayer/
COPY ./SongLayer/SongLayer.csproj ./SongLayer/

RUN dotnet restore

RUN dotnet build -c Release -o /app/build

RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "AuthLayer.dll"]
