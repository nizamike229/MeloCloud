FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY ./MyMusicApp.sln ./
COPY ./SongLayer/SongLayer.csproj ./SongLayer/
COPY ./AuthLayer/AuthLayer.csproj ./AuthLayer/

RUN dotnet restore MyMusicApp.sln

RUN dotnet build ./SongLayer/SongLayer.csproj -c Release -o /app/build

RUN dotnet publish ./SongLayer/SongLayer.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "SongLayer.dll"]
