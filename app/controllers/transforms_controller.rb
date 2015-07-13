class TransformsController < ApplicationController
	def index
		@transforms = Transforms.transforms
	end

	def show
		@transform = load_transform
	end

	private

	def load_transform
		Transforms[params.require(:name)]
	end
end