require 'rails_helper'

RSpec.describe MatrixConversions do
	let(:matrix) { Matrix[[1,2,3,7],[3,4,5,9]] }
	let(:point_array) { [Point.new(1,3), Point.new(2,4), Point.new(3, 5), Point.new(7, 9)] }
	let(:point_set) { Set.new(point_array) }

	describe ".from_point_set" do
		subject { MatrixConversions.from_point_set(point_set) }

		it "should return a new matrix" do
			is_expected.to eq matrix
		end
	end

	describe ".from_point_array" do
		subject { MatrixConversions.from_point_array(point_array) }

		it "should return a new matrix" do
			is_expected.to eq matrix
		end
	end

	describe ".to_point_set" do
		subject { MatrixConversions.to_point_set(matrix) }

		it "should be correct" do
			is_expected.to eq point_set
		end
	end

	describe ".to_point_array" do
		subject { MatrixConversions.to_point_array(matrix) }

		let(:expected_result) {  }

		it "should be correct" do
			is_expected.to eq point_array
		end
	end

	describe ".apply_offset" do
		subject { MatrixConversions.apply_offset(matrix, x_offset, y_offset) }

		let(:x_offset) { 3 }
		let(:y_offset) { 1 }
		let(:expected_result) { Matrix[[4, 5, 6, 10],[4, 5, 6, 10]] }

		it "should offset the matrix" do 
			is_expected.to eq expected_result
		end
	end
end