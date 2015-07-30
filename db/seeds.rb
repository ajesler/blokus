password = "asdfasdf"
User.create!([
  {name: "User One", email: "andrew.esler+one@powershop.co.nz", password: password, password_confirmation: password, reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil},
  {name: "User Two", email: "andrew.esler+two@powershop.co.nz", password: password, password_confirmation: password, reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil},
  {name: "User Three", email: "andrew.esler+three@powershop.co.nz", password: password, password_confirmation: password, reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil},
  {name: "User Four", email: "andrew.esler+four@powershop.co.nz", password: password, password_confirmation: password, reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil}
])

game = Game.new
game.players.build(user: User.find(1))
game.save!

game.players.create!(user: User.find(2))
game.players.create!(user: User.find(3))
game.players.create!(user: User.find(4))

Turn.create!([
  {player_id: 1, shape: "T4", transform: "rotate_90_anticlockwise", x: 0, y: 0},
  {player_id: 2, shape: "Z5", transform: "reflect_in_y_x", x: 17, y: 17},
  {player_id: 3, shape: "F", transform: "identity", x: 0, y: 17},
  {player_id: 4, shape: "Y", transform: "rotate_90_anticlockwise", x: 16, y: 0},
  {player_id: 1, shape: "F", transform: "rotate_180", x: 1, y: 2},
  {player_id: 2, shape: "I5", transform: "rotate_90_clockwise", x: 12, y: 16},
  {player_id: 3, shape: "I5", transform: "rotate_90_clockwise", x: 3, y: 17},
  {player_id: 4, shape: "L5", transform: "reflect_in_y_neg_x", x: 12, y: 1},
  {player_id: 1, shape: "U", transform: "rotate_90_clockwise", x: 4, y: 3},
  {player_id: 2, shape: "Y", transform: "reflect_in_y_x", x: 8, y: 15},
  {player_id: 3, shape: "W", transform: "identity", x: 8, y: 16},
  {player_id: 4, shape: "Z5", transform: "identity", x: 10, y: 3}
])
