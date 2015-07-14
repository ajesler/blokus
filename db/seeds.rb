password = "asdfasdf"
User.create!([
  {name: "User One", email: "andrew.esler+one@powershop.co.nz", password: password, password_confirmation: password, reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil},
  {name: "User Two", email: "andrew.esler+two@powershop.co.nz", password: password, password_confirmation: password, reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil},
  {name: "User Three", email: "andrew.esler+three@powershop.co.nz", password: password, password_confirmation: password, reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil},
  {name: "User Four", email: "andrew.esler+four@powershop.co.nz", password: password, password_confirmation: password, reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil}
])