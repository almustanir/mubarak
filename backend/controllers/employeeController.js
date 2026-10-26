import Employee from "../model/Employee.js";
import User from "../model/User.js";

//create an employee

export const createEmployee = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Profile image is required." });
    }

    const {
      employeeId,
      name,
      email,
      workEmail,
      workPassword,
      phone,
      gender,
      department,
      designation,
      salary,
      salaryPeriod,
      joiningDate,
      bankName,
      accountNumber,
      ifscCode,
      accountStatus,
    } = req.body;

    const existingEmployee = await Employee.findOne({
      $or: [{ employeeId }, { email }, { workEmail }],
    });
    if (existingEmployee) {
      if (existingEmployee.employeeId === employeeId) {
        return res
          .status(400)
          .json({ success: false, message: "Employee ID already exists" });
      }
      if (existingEmployee.email === email) {
        return res
          .status(400)
          .json({ success: false, message: "Personal email already exists" });
      }
      if (existingEmployee.workEmail === workEmail) {
        return res
          .status(400)
          .json({ success: false, message: "Work email already exists" });
      }
      return res
        .status(400)
        .json({ success: false, message: "Employee already exists" });
    }

    const existingUser = await User.findOne({ email: workEmail });
    if (existingUser) {
      const correspondingEmployee = await Employee.findOne({ workEmail });
      if (!correspondingEmployee && existingUser.role !== "admin") {
        await User.deleteOne({ _id: existingUser._id });
      } else {
        return res
          .status(400)
          .json({
            success: false,
            message: "User account with this work email already exists",
          });
      }
    }

    const hashedPassword = await bcrypt.hash(workPassword, 10);

    let profileImageUrl = "";
    //to store profile image
    if (req.file) {
      try {
        const fileName = `emp_profile_${employeeId}_${Date.now()}_${req.file.originalname}`;
        const uploadResult = await uploadToImageKit(req.file.buffer, fileName);
        profileImageUrl = uploadResult.url;
      } catch (uploadErr) {
        return res
          .status(500)
          .json({ success: false, message: uploadErr.message });
      }
    }

    let employee;
    try {
      employee = await Employee.create({
        employeeId,
        name,
        email,
        workEmail,
        workPassword,
        phone,
        gender,
        department,
        designation,
        salary,
        salaryPeriod,
        joiningDate,
        bankName,
        accountNumber,
        ifscCode,
        accountStatus,
        profileImage: profileImageUrl,
      });
    } catch (dbErr) {
      if (profileImageUrl) {
        await deleteFromImageKit(profileImageUrl).catch((err) =>
          console.error("ImageKit rollback failed:", err),
        );
      }
      return res.status(500).json({ success: false, message: dbErr.message });
    }

    try {
      await User.create({
        name,
        email: workEmail,
        password: hashedPassword,
        role: "user",
        isVerified: true,
      });
    } catch (userErr) {
      await Employee.findByIdAndDelete(employee._id);
      if (profileImageUrl) {
        await deleteFromImageKit(profileImageUrl).catch((err) =>
          console.error("ImageKit rollback failed:", err),
        );
      }
      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to create user login credentials: " + userErr.message,
        });
    }

    return res
      .status(201)
      .json({
        success: true,
        message: "Employee created successfully",
        employee,
      });
  } catch (error) {}
};
