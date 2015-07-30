class TurnsController < ApplicationController
  before_action :load_player
  before_action :load_game

  def index
    @turns = @game.turns.play_order
  end

  def create
    create_turn_params = CreateTurnFormObject.new(params)
    if create_turn_params.valid?
      created = PlayPiece.new(@player, create_turn_params.coordinates).call
      if created
        WebsocketRails[websocket_channel_name].trigger(:update, { :updated => true })
        @message = "OK"
      else
        @message = "Failed to create turn for player #{@player.name}. PlayPiece failed."
        render :create, :status => :internal_server_error
      end
    else
      @message = "Failed to create turn for player #{@player.name}. Invalid params."
      render :create, :status => :internal_server_error
    end
  end

  private

  def load_player
    @player = current_user.players.find_by!(game_id: game_id)
  end

  def load_game
    @game = @player.game
  end

  def game_id
    params.require(:game_id)
  end

  def websocket_channel_name
    ("game_"+@game.id.to_s).to_sym
  end
end