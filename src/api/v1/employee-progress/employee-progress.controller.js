const appRoot = require('app-root-path');
const EmployeeProgress = require(appRoot + '/src/models/employee-progress');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');

const { status, messages } = appConstants;


exports.getEmployeeProgress = async (req, res) => {
    try {
        const employeeProgress = await EmployeeProgress.find(req.query);
        return res.status(status.success).json({
            message: 'Progress found Successfully.',
            data: employeeProgress,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}


exports.createProgress = async (req, res) => {
    try {
        const { employee_id, video_id, created_by } = req.body;
        let progressExist = EmployeeProgress.find({ employee_id: employee_id });
        if (progressExist) {
            const dataToUpdate = {
                $push: {video_ids: video_id },
                updated_by: created_by,
            }
            const updatedProgress = EmployeeProgress.findOneAndUpdate({ employee_id: employee_id }, dataToUpdate, { new: true });
            return res.status(status.success).json({
                message: 'Progress Created Successfully.',
                data: updatedProgress,
            });
        } else {
            const employeeProgress = await EmployeeProgress.create(req.body);
            return res.status(status.success).json({
                message: 'Progress Created Successfully.',
                data: employeeProgress,
            });
        }
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}