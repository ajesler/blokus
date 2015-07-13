class ShapesController < ApplicationController
	def index
		@shapes = Shapes.shapes

		respond_to do |format|
			format.json { render json: @shapes }
		end
	end

	def show
		@shape = load_shape

		respond_to do |format|
			format.json { render json: @shape }
		end
	end

	private

	def load_shape
		Shapes[params.require(:name)]
	end
end