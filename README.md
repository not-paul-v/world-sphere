# world-sphere

## Beams

### Find nearest tile

-   generated Coordinates returns list of tile coordinates per country sorted by
    latitude
-   for beam at lat x, lon y iterate over the tiles of each country
-   ignore all coordinate pairs with latitude greater or less than the rounded
    value of x
-   search for both rounded values of x and y being equal with a tiles
    coordinate
-   create beam found coordinate

-> **Disadvantage**: Cannot place beams on non land parts

-> **Solution**: if tile with matching coordinates cannot be found, place beam
at given coordinates

## TODO:

-   hover performance sucks
