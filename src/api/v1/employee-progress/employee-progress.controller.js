const appRoot = require('app-root-path');
const EmployeeProgress = require(appRoot + '/src/models/employee-progress');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');

const { status, messages } = appConstants;


exports.getEmployeeProgressById = async (req, res) => {
    try {
        const { is_populate } = req.query;
        let employeeProgress;
        if (is_populate) {
            employeeProgress = await EmployeeProgress.findOne({ employee_id: req.params.id}).populate("video_ids");
        } else {
             employeeProgress = await EmployeeProgress.findOne({ employee_id: req.params.id});
        }
        return res.status(status.success).json({
            message: 'Employee Progress found Successfully.',
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
        const progressExist = await EmployeeProgress.findOne({ employee_id: employee_id });
        if (progressExist) {
            if (!progressExist.video_ids.includes(video_id)) {
                const dataToUpdate = {
                    $push: { video_ids: video_id },
                    updated_by: created_by,
                }
                const updatedProgress = await EmployeeProgress.findByIdAndUpdate({ _id: progressExist._id }, dataToUpdate, { new: true });
                return res.status(status.success).json({
                    message: 'Progress Created Successfully.',
                    data: updatedProgress,
                });
            } else {
                return res.status(status.success).json({
                    message: 'Already watched video',
                });
            }
        } else {
            const dataToCreate = {
                employee_id: employee_id,
                created_by: created_by,
                video_ids:  [video_id],
            }
            const employeeProgress = await EmployeeProgress.create(dataToCreate);
            return res.status(status.success).json({
                message: 'Progress Created Successfully.',
                data: employeeProgress,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}