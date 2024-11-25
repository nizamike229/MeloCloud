FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY ./MyMusicApp.sln ./
COPY ./AuthLayer/AuthLayer.csproj ./AuthLayer/
COPY ./SongLayer/SongLayer.csproj ./SongLayer/

RUN dotnet restore MyMusicApp.sln

RUN dotnet build ./AuthLayer/AuthLayer.csproj -c Release -o /app/build

RUN dotnet publish ./AuthLayer/AuthLayer.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "AuthLayer.dll"]
