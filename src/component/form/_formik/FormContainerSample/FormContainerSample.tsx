import React from 'react';
import { Formik } from 'formik';
import * as Yup from "yup";
import { FormControl, APP_FORM_CONTROL } from '../FormControl/FormControl';
import { Radio } from 'react-radio-group';
import Select from 'react-select/src/Select';

interface ISubnetForm {
    title: string;
    password: string;
    description: string;
    ipv4: string;
    tags: Array<{ label: string, value: string }>;
    images: Array<File>;
    RAngeSlider: any;
    checkbox: boolean;
    slider: number;
    radio: string;
}

export class FormContainerSample extends React.Component {

    options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
        { value: "test", label: "test" },
        { value: "تست", label: "تست" },
        { value: "apple", label: "apple" },
        { value: "tangerine", label: "tangerine" },
    ];

    initialValues: ISubnetForm = {
        title: "",
        description: "",
        password: "",
        ipv4: "",
        tags: [],
        images: [],
        RAngeSlider: [1, 8],
        checkbox: true,
        slider: 0,
        radio: ""
    };

    onSubmit = (values: ISubnetForm, { setSubmitting, setErrors, setStatus, resetForm }: any) => {
        resetForm({})
    };

    validation = Yup.object({
        ipv4: Yup.number().required('Required'),
        description: Yup.string().required('Required'),
        tags: Yup.array().required('ejbari').min(2, 'do ta bezan'),
    });

    render() {
        return (
            <div>
                <Formik
                    initialValues={this.initialValues}
                    onSubmit={this.onSubmit}
                    validationSchema={this.validation}
                >
                    {({ handleSubmit, isValid }) => (
                        <>
                            <div className="row">
                                <div className="col-md-6">
                                    <FormControl<ISubnetForm> control={APP_FORM_CONTROL.INPUT}
                                        name={"title"} />
                                </div>
                                <div className="col-md-6">
                                    <FormControl<ISubnetForm> control={APP_FORM_CONTROL.INPUT}
                                        name={"password"} />
                                </div>
                                <div className="col-md-6">
                                    <FormControl<ISubnetForm> control={APP_FORM_CONTROL.NUMBER}
                                        name={"ipv4"} />
                                </div>
                                <div className="col-md-12">
                                    <FormControl<ISubnetForm> control={APP_FORM_CONTROL.TEXTAREA}
                                        name={"description"}
                                        rows={2}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <FormControl<ISubnetForm> control={APP_FORM_CONTROL.SELECT}
                                        name={"tags"}
                                        label="t a g s"
                                        options={this.options}
                                        isMulti
                                    />
                                </div>
                                <div className="col-md-12">


                                    <FormControl<ISubnetForm> control={APP_FORM_CONTROL.RANGESLIDER}
                                        name={"RAngeSlider"}
                                        label="RAnge Slider"
                                        allowCross={false}
                                        defaultValue={[0, 120]}
                                        min={0}
                                        max={120}

                                    />
                                </div>
                                <div className="col-md-12">

                        
                                    <FormControl<ISubnetForm> control={APP_FORM_CONTROL.SLIDER}
                                        name={"slider"}
                                        label="slider"
                                        railStyle={{
                                            height: 2,
                                        }}
                                        handleStyle={{
                                            height: 18,
                                            width: 18,
                                            marginLeft: 5,
                                            marginTop: -8,
                                            backgroundColor: "rgb(43, 226, 255)",
                                        }}
                                        trackStyle={{
                                            background: "none",
                                        }}
                                        min={0}
                                        max={120}

                                    />
                                </div>
                                <div className="col-md-12">
                                    <FormControl<ISubnetForm> control={APP_FORM_CONTROL.CHECKBOX}
                                        name={"checkbox"}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <FormControl<ISubnetForm> control={APP_FORM_CONTROL.RADIOBUTTON}
                                        name={"radio"}
                                    >
                                        <Radio
                                            required={true}
                                            value="apple"
                                            color={"blue"}
                                            size={5}
                                        />
                                        <Radio required={true} value="orange" />
                                    </FormControl>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-12">
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleSubmit()}
                                        disabled={!isValid}
                                    >save</button>
                                </div>
                            </div>
                        </>
                    )}
                </Formik>
            </div>
        )
    }
}