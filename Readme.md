## Blokus

A JS driven implementation of Blokus, with a Rails API version. 

There are 21 pieces per player.

### Rails notes

`rake db:fixtures:load FIXTURES_PATH=spec/fixtures` to load fixtures into the db of the current environment.


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


### Model Design

#### ActiveRecord Models

- User
	- name
	- devise for auth - how will it integrate with Rails API?

- Player
	- user
	- game
	- turns

- Game 
	- players
	- turns
	- shapes - the set of shapes available to each player

- Turn
	- player
	- shape - empty if no player passed - use enums?
	- transform - empty if player passed
	- position (x, y) - empty if player passed


#### Concerns

- Shape
	- name
	- definition (points in a matrix)

- Transform
	- name
	- matrix

- Board
	- size: 20x20

- Point - struct
	- x
	- y


### Implementation Notes

Do all shape / piece identity work on the backend - eg front end asks for /game/players/pieces to return a set of all available pieces & isomers.

Aim is to implement without any external JS libraries. D3 may prove useful for rendering the board.

Matrix transforms could be handy for rotating / flipping blocks. See `experiments/matrix_rotation_test.rb`  

Would be useful to be able to get all a players blocks positions occupied when checking if new block placement is valid.

SVG for rendering the board from a JSON blob?  

An invalid placement should show feedback to the user before they make the placement. Eg change shading of a block if it is an invalid move.  

Web socket impl on backend so that no refresh required when its your turn.


#### Block Positioning Validation

Create a BlockDefinition for each of the 21 blocks.

Validation Checks for blocks need to look at:
- If it is the first block a player has placed, it must cover a corner square of the board.
- That the positions are not used. Can check this by finding all the positions that have been used on the board by blocks.
- That at least one corner is touching the corner of another block owned by the placing player
- The block being placed does not share edges with any block owned by the placing player.
- That the given positions match the shape defined in the BlockDefinition for the particular block type. Horizontal / vertical line checking is easy, doing complex shapes is harder. 8 possible forms for each block. Could create a shape centered on 0,0, then apply each transform to find a match. Some shapes have less than 8 forms, for example the cross only has one form.
	- What are the options for doing this checking? Only doing one shape at a time, so 8 possibilities will be pretty fast to check.
	- Find centroid of shape, offset to match definition, and check rotations?
	- Store an origin point of each shape to validate, and use this as a starting point for checking rotations.
	- Least squares fitting of two 3d point sets - http://162.105.204.96/teachers/yaoy/Fall2011/arun.pdf


### TODO

- Move shapes to the DB
- Add an HTML view for the shapes - perhaps showing each?

### Extras

- Offer hints to the player as to where a particular block could be placed.
- Show all squares that can be covered with the players available blocks.
- Build an AI to play against. f
- Support different game types, eg duo & trigon