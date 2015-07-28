class CreateTurnFormObject
  attr_reader :coordinates, :player

  def initialize(params)
    @params = params
    @coordinates = extract_coordinates
    @player = params.require(:player_id)
  end

  def valid?
    !@coordinates.nil? && !@player.nil?
  end

  private

  def extract_coordinates
    coordinate_params = @params.require(:coordinates).delete_if { |entry| entry.blank? }

    if !coordinate_params.empty?
      @coordinates = coordinate_params.map { |coordinate| Point.from_string(coordinate) }
    else
      @coordinates = []
    end
  end
end