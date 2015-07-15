require 'rails_helper'

RSpec.describe MatrixConversions do
	let(:matrix) { Matrix[[1,2,3,7], [3,4,5,9]] }
	let(:point_array) { [Point.new(1,3), Point.new(2,4), Point.new(3, 5), Point.new(7, 9)] }
	let(:point_set) { Set.new(point_array) }

	describe ".from_point_set" do
		subject { MatrixConversions.from_point_set(point_set) }

		it "should return a new matrix" do
			expect(subject).to eq matrix
		end
	end

	describe ".from_point_array" do
		subject { MatrixConversions.from_point_array(point_array) }

		it "should return a new matrix" do
			expect(subject).to eq matrix
		end
	end

	describe ".to_point_set" do
		subject { MatrixConversions.to_point_set(matrix) }

		it "should be correct" do
			expect(subject).to eq point_set
		end
	end

	describe ".to_point_array" do
		subject { MatrixConversions.to_point_array(matrix) }

		let(:expected_result) {  }

		it "should be correct" do
			expect(subject).to eq point_array
		end
	end

	describe ".apply_offset" do
		subject { MatrixConversions.apply_offset(matrix, x_offset, y_offset) }

		let(:x_offset) { 3 }
		let(:y_offset) { 1 }
		let(:expected_result) { Matrix[[4, 5, 6, 10], [4, 5, 6, 10]] }

		it "should offset the matrix" do 
			expect(subject).to eq expected_result
		end
	end

	describe ".move_to_origin" do
		let(:expected_result) { Matrix[[0, 1, 2, 0, 2], [0, 0, 0, 1, 1]] }
		let(:expected_to_cover_one_of) { Set.new([Point.new(0, 0), Point.new(0, 1), Point.new(1, 0)]) }

		shared_context "moves to origin" do
			it "moves the piece such that there are no negative x or y positions and one of 0,0 | 0,1 | 1,0 is used" do
				result = MatrixConversions.move_to_origin(matrix)
				result_as_points = MatrixConversions.to_point_set(result)

				expect(result).to eq expected_result

				expect(result_as_points.intersect?(expected_to_cover_one_of)).to be true
			end
		end

		context "when the piece has negative coordinates" do
			let(:matrix) { Matrix[[-3, -2, -1, -3, -1], [-2, -2, -2, -1, -1]] }

			include_context "moves to origin"
		end

		context "when the piece has positive coordinates" do
			let(:matrix) { Matrix[[7, 8, 9, 7, 9], [4, 4, 4, 5, 5]] }

			include_context "moves to origin"
		end
	end

	describe ".min_in_row" do
		it "returns the minimum value in a row" do
			expect(MatrixConversions.min_in_row(matrix, 0)).to eq 1
			expect(MatrixConversions.min_in_row(matrix, 1)).to eq 3
		end
	end
end