# Tic tac toe game

## Backend

This is a tic tac toe game which uses socket.io to allow a multiplayer experience. When someone signs in, a pop up will appear if more players are on the lobby. Users can accept or decline the request. Once the game starts, players need to wait for their turn to move. There's also a chat sistem where players can chat with their opponents.

## To run the project install packages

```bash
  npm i
```

Don't forget to config the .env fil accordin to the .env.example. This projet was created to be used on PORT 4000.

The front code can be found [Here](https://github.com/ZabdielSeg/tic-tac-toe-client)

## Main routes:


|   Route   | HTTP Verb |   Description   |
|-----------|-----------|-----------------|
| `/update-user/:userID` |    PUT    | Update user stats|
| `/all-users` |    GET    | Gets all users registrations list|


### Enjoy the game