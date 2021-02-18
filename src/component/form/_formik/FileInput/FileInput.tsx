import React from 'react';
import { Field, FieldInputProps, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';

export interface IProps<T> extends
    // DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    Partial<Omit<FieldInputProps<any>, 'name'>>,
    Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
    IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.FILE_INPUT;
    controlsize?: 'sm' | 'lg';
    itemsrender?: (value: File[], setFieldValue: (field: string, value: any) => void) => React.ReactNode;
}

interface IState {
    dragClassName: string;
}

export class FileInput<T> extends FormElementBase<T, IProps<T>, IState>{
    state = {
        dragClassName: ''
    };

    // private formControlClassName(): string {
    //     const size = this.props.controlsize ? ` form-control-${this.props.controlsize}` : '';
    //     return 'form-control' + size;
    // }
    private remvoveItem(index: number, value: Array<File>, setFieldValue: (field: string, value: any) => void) {
        const val = [...value];
        val.splice(index, 1);
        setFieldValue(this.props.name as string, val);
    }

    // private itemRender(f: File, i: number, value: File[], setFieldValue: (field: string, value: any) => void) {
    //     return <div key={i}>
    //         <i className="fa fa-times text-danger cursor-pointer mr-2"
    //             onClick={() => this.remvoveItem(i, value, setFieldValue)}
    //         ></i>
    //         <span>{f.name}</span>
    //     </div>;
    // }
    // private formatData(files: Array<File>) {
    //     debugger;
    //     // let reader = new FileReader();
    //     // e.preventDefault();

    //     let reader = new FileReader();
    //     // let file = e.target.files[0];

    //     reader.onloadend = () => {
    //         // this.setState({
    //         //     file: file,
    //         //     imagePreviewUrl: reader.result
    //         // });
    //         const bb = reader.result;
    //         debugger;
    //     };

    //     reader.readAsDataURL(files[0]);
    //     const aa = reader.result;
    //     debugger;
    // }

    protected fieldRender() {
        const { name, form, itemsrender, ...rest } = this.props;
        return <Field name={name}>
            {({ form, field }: FieldProps<Array<File>, T>) => {
                const { setFieldValue } = form;
                const { value } = field;
                // console.log('const { value } = field;', value);
                // const fileName = value.name || '';

                return <div className="custom-file">
                    <input
                        id={this.id}
                        name={name as string}
                        type="file"
                        {...rest as any}
                        onChange={(event) => {
                            const files = event.currentTarget.files || [];
                            const newFileList = Array.from(files);

                            if (newFileList.length) {
                                // this.formatData(newFileList);
                                setFieldValue(name as string, newFileList);
                            }
                        }}
                        className="custom-file-input"
                        draggable={false}
                        onDragEnter={(e) => {
                            this.setState({ dragClassName: 'bordered-dark' });
                            // console.log('onDragEnter', e);
                            // e.currentTarget.classList.add('gholi');
                        }}
                        onDragLeave={(e) => {
                            this.setState({ dragClassName: '' });
                            // console.log('onDragLeave', e);
                            // e.currentTarget.classList.remove('gholi');
                        }}
                        // onDragEnd={(e) => {
                        //     console.log('onDragEnd', e);
                        // }}
                        // onDragExit={(e) => {
                        //     console.log('exit', e);
                        // }}
                        onDrop={(e) => {
                            this.setState({ dragClassName: '' });
                            // console.log('onDrop', e);
                            // e.currentTarget.classList.remove('gholi');
                        }}
                    />

                    {/* <Field
                        type="file"
                        className="custom-file-input"
                        id={this.id}
                        name={name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            console.log('file event', event);
                            const files = event?.currentTarget?.files;
                            const v = files ? files[0] : '';
                            // event.currentTarget.value
                            setFieldValue(name as string, files);
                        }}
                        {...rest}
                        value={''}
                    /> */}
                    <label className={`custom-file-label ${this.state.dragClassName}`} htmlFor={this.id}>{
                        (value && value.length) ? value.length : this.props.placeholder
                    }</label>
                    {
                        this.props.itemsrender ?
                            this.props.itemsrender([...value], setFieldValue)
                            : ((value && value.length) ? value.map((f, i) => <div key={i}>
                                <i className="fa fa-times text-danger cursor-pointer mr-2"
                                    onClick={() => this.remvoveItem(i, [...value], setFieldValue)}
                                ></i>
                                <span>{f.name}</span>
                            </div>) : <></>)
                    }
                </div>
                // return <Field type="file" className={this.formControlClassName()} id={this.id} name={name} {...rest} />
            }}
        </Field>
    }
}
