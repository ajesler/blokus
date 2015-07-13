class ShapesController < ApplicationController
	def index
		@shapes = Shapes.shapes
	end

	def show
		@shape = load_shape
	end

	private

	def load_shape
		Shapes[params.require(:name)]
	end
end