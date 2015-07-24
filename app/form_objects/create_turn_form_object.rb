class CreateTurnFormObject
  attr_reader :coordinates, :player

  def initialize(params)
    @params = params
    @coordinates = extract_coordinates
    @player = params.require(:player_id)
  end

  def valid?
    @coordinates.all? && @coordinates.size >= 1
    # TODO check if active player is the submitting player
    # TODO check if the current user owns the given player id
  end

  private

  def extract_coordinates
    @coordinates = @params.require(:coordinates).map { |coordinate| Point.from_string(coordinate) }
  end
end