class ShapeValidator < ActiveModel::EachValidator
	def validate_each(record, attribute, value)
		valid_shape_name = value.nil? || Shapes.names.include?(value)
		record.errors.add attribute, " must be a recognised shape name." unless valid_shape_name
	end
end