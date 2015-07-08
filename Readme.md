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


### Model Design

#### ActiveRecord Models

- User
	- name
	- devise for auth - how will it integrate with Rails API?


- Player
	- user
	- game


- Game
	- players
	- active_player
	- blocks (scopes like player(p1), placed, not_placed)


- Block
	- player
	- type
	- positions_occupied - serialized or separate objects?
	number of turn that the block was placed. Required for advanced scoring? Or could use last_updated_at to find most recently placed block? Would anything else update a block and interfere with this? Everything but positions_occupied assigned at creation.


Coordinates
	- block
	- x
	- y


- Board - this is a concept, not an AR record
	- size: 20x20

#### Concerns

- 2DPoint
	Envisioned for use in block checks. Can be used interchangably with Coordinates objects. Or create a Geometry module with a Coordinates object? Seems like it would be confusing.
	Make 2DPoint methods a module so can be included in Coordinates?
	- x
	- y


- BlockDefinition 
	- name
	- size
	- shape (defined as a matrix containing a set of coordinates. This makes checking for rotation simpler. Array/Set also possible.)
	provides the canonical shape of a type of block. There will be 21 of these, and they will be constants, as each game uses the same set of blocks. 


- BlockDefinitionContainer
	Stores a hash of name => BlockDefinition for all blocks in the game
	Allows lookup of a BlockDefinition from a name
	Can be used to get a collection of all block types
	BlockDefinitionContainer.blocks
	BlockDefinitionContainer[:block_name]
	BlockDefinitionContainer::BLOCKS

	Blocks.names
	Blocks.blocks
	Blocks[:block_name]

	File that defines a constant BLOCKS? Universally available.



### Implementation Notes

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


### Extras

- Offer hints to the player as to where a particular block could be placed.
- Build an AI to play against. 