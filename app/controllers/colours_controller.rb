class ColoursController < ApplicationController
	def index
		@colours = Colours.colours

		render json: @colours
	end

	def show
		@colour = load_colour

		render json: @colour
	end

	private

	def load_colour
		Colours.colours[params.require(:index).to_i]
	end
end