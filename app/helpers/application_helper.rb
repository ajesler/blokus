module ApplicationHelper
  def meta_game_id(game)
    content_for :meta_game_id, game.id.to_s
  end
end
