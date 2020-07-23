const Church = require('../models/churchModel');

module.exports = {
  async index() {
    try {
      const churchs = await Church.find().populate(['createdBy', 'updatedBy']);
      return churchs;
    } catch (error) {
      return error;
    }
  },

  async show(id) {
    try {
      const church = await Church.findById(id);
      return church;
    } catch (error) {
      return error;
    }
  },

  async store(name, address, userId) {
    try {
      const church = await Church.create({
        name,
        address,
        createdBy: userId,
      });

      await church.save();

      return church;
    } catch (error) {
      return error;
    }
  },

  async update(id, name, address, userId) {
    try {
      const church = await Church.findByIdAndUpdate(
        id,
        {
          name,
          address,
        },
        { new: true }
      );

      church.updatedAt = new Date();
      church.updatedBy = userId;

      await church.save();

      return church;
    } catch (error) {
      return error;
    }
  },

  async destroy(id) {
    try {
      await Church.findByIdAndRemove(id);
      return true;
    } catch (error) {
      return error;
    }
  },
};
