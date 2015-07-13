class ColoursController < ApplicationController
	def index
		@colours = Colours.colours

		respond_to do |format|
			format.json { render json: @colours }
		end
	end

	def show
		@colour = load_colour

		respond_to do |format|
			format.json { render json: @colour }
		end
	end

	private

	def load_colour
		Colours.colours[params.require(:index).to_i]
	end
end