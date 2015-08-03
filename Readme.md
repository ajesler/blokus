## Blokus

A JS driven implementation of Blokus, with a Rails API version. 

There are 21 pieces per player.


### Rules

1. First block placed must cover a corner square.
2. Subsequent blocks of the same colour must touch a corner of a block of the same colour, but cannot share an edge with a block of the same colour. 
3. A player is out once they can no longer place a block on the board. 
4. Game ends when no players can play a block, either because they are blocked or have used all their pieces.  

May add rules for three and two player games later.  


#### Scoring

##### Basic Scoring  

Player with the lowest number of unplayed squares wins.  

##### Advanced Scoring  

Each player counts the number of squares in their remaining pieces. 1 square = -1 point.
A player earns +15 points if all of their pieces have been placed on the board plus 5 additional points if the last piece they placed on the board was the smallest piece (one square). 

##### Alternative Scoring

One point for each board square covered, +15 if all pieces used. +5 if last piece player placed was the 1 square piece. (Max = 109?)


#### Block Positioning Validation

Create a BlockDefinition for each of the 21 blocks.

Validation Checks for blocks need to look at:
- If it is the first block a player has placed, it must cover a corner square of the board.
- That the positions are not used. Can check this by finding all the positions that have been used on the board by blocks.
- That at least one corner is touching the corner of another block owned by the placing player
- The block being placed does not share edges with any block owned by the placing player.
- That the given positions match the shape defined in the BlockDefinition for the particular block type. Horizontal / vertical line checking is easy, doing complex shapes is harder. 8 possible forms for each block. Could create a shape centered on 0,0, then apply each transform to find a match. Some shapes have less than 8 forms, for example the cross only has one form.


### TODO

- Move shapes to the DB
- Support for 2-4 players
- Test board.js


### Extras

- Extended hint mode: show which pieces can be played where
- An AI to play against
- Support different game types, eg duo & trigon


### Notes

- [Blokus Variations](http://pentolla.com/variations.shtml)
- [Barasona opening](http://boardgamegeek.com/image/112251/blokus)
- [Pentobi](http://pentobi.sourceforge.net/)
- [Pentolla](http://pentolla.com/)