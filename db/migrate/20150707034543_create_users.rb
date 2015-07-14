class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name, null: false

      t.timestamps null: false
    end
  end

  # TODO create name index that is unique
end
