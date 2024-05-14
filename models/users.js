const mongoose=require('mongoose')  ;

const UserSchema = mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId 
     },
    nom: {
      type: String,
      required: true,
      min: 3
    },
    prenom: {
      type: String,
      required: true,
      min:3
    },
    motDePasse: {
      type: String,
      required: true,
      min: 3

    },
    email: {
      type: String,
      required: true,
      min: 5

    },
    hasProfile: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
     enum: ['Directeur', 'StaffMedical', 'Coach','StaffPhysique'],
      default: 'Coach',
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User",  UserSchema);

