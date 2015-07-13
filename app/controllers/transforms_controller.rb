class TransformsController < ApplicationController
	def index
		@transforms = Transforms.transforms

		respond_to do |format|
			format.json { render json: @transforms }
		end
	end

	def show
		@transform = load_transform
		respond_to do |format|
			format.json { render json: @transform }
		end
	end

	private

	def load_transform
		Transforms[params.require(:name)]
	end
end