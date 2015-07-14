class ShapeIdentification < Struct.new(:shape, :transform, :position)
	NOT_IDENTIFIED = ShapeIdentification.new(nil, nil, nil)

	def identified?
		self != NOT_IDENTIFIED
	end
end