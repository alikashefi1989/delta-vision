import React from 'react';
import { Field, FieldInputProps, FieldProps } from 'formik';
import {
    FormElementBase,
    IFormElementBaseProps,
} from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import { IMedia } from '../../../../model/media.model';

export interface IProviderProps {
    fieldName: string;
    values: Array<File | IMedia>;
    files: Array<ProvidedFile>;
    setFieldValue: (field: string, value: Array<File | IMedia>) => void;
    removeFunction: (
        index: number,
        fieldName: string,
        value: Array<File | IMedia>,
        setFieldValue: (field: string, value: any) => void
    ) => void;
    sortFunction: (
        fieldName: string,
        value: Array<File | IMedia>,
        setFieldValue: (field: string, value: any) => void
    ) => void;
}

export interface IProps<T>
    // DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    extends Partial<Omit<FieldInputProps<any>, 'name'>>,
        Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
        IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.MULTI_FILE_INPUT;
    controlsize?: 'sm' | 'lg';
    provider?: (providerProps: IProviderProps) => React.ReactNode;
    multiFileWrapperClass?: string;
    multiFileInputClass?: string;
    multiFileLabelClass?: string;
    labelContent?: JSX.Element | string;
    controllableMultiple?: boolean;
    ratio?: number;
    ratioError?: (w: number, h: number) => any;
}

interface IState {
    dragClassName: string;
}

export interface ProvidedFile {
    file: File | IMedia;
    src: string;
    index: number;
    id: string;
}

export class MultiFileInput<T> extends FormElementBase<T, IProps<T>, IState> {
    state = {
        dragClassName: '',
    };

    private remvoveItem(
        index: number,
        field: string,
        value: Array<File | IMedia>,
        setFieldValue: (field: string, value: any) => void
    ) {
        debugger;
        const val = [...value];
        val.splice(index, 1);
        // setFieldValue(this.props.name as string, val);
        debugger;
        setFieldValue(field, val);
        debugger;
    }

    private sortItems(
        field: string,
        value: Array<File | IMedia>,
        setFieldValue: (field: string, value: any) => void
    ) {
        const val = [...value];
        setFieldValue(field, val);
    }

    private fileOrMediaDetector(item: File | IMedia): string {
        let fields: Array<string> = Object.keys(item);
        if (fields.includes('id') || fields.includes('url')) {
            return (item as IMedia).url || '';
        } else {
            return URL.createObjectURL(item as File) || '';
        }
    }

    private fileItemsProvider(
        values: Array<File | IMedia>
    ): Array<ProvidedFile> {
        if (!values.length) {
            return [];
        } else {
            return values.map((item: File | IMedia, i: number) => {
                return {
                    file: item,
                    src: this.fileOrMediaDetector(item),
                    index: i,
                    id: i.toString(),
                };
            });
        }
    }

    protected fieldRender() {
        const {
            name,
            form,
            provider,
            multiFileWrapperClass,
            multiFileInputClass,
            multiFileLabelClass,
            labelContent,
            controllableMultiple,
            ratio,
            ratioError,
            ...rest
        } = this.props;
        return (
            <Field name={name}>
                {({ form, field }: FieldProps<Array<File | IMedia>, T>) => {
                    const { setFieldValue } = form;
                    const { value } = field;
                    // console.log('const { value } = field;', value);
                    // const fileName = value.name || '';

                    return (
                        <div
                            className={`custom-multi-file ${
                                this.props.multiFileWrapperClass || ''
                            }`}
                        >
                            <input // visibelaty : hidden
                                id={this.id}
                                name={name as string}
                                type="file"
                                {...(rest as any)}
                                onChange={(event) => {
                                    const files =
                                        event.currentTarget.files || [];
                                    debugger;
                                    const newFileList = Array.from(files);
                                    debugger;

                                    if (newFileList.length) {
                                        // this.formatData(newFileList);
                                        if (this.props.multiple === true) {
                                            setFieldValue(
                                                name as string,
                                                value.concat(newFileList)
                                            );
                                        } else {
                                            if (!this.props.ratio) {
                                                setFieldValue(
                                                    name as string,
                                                    newFileList
                                                );
                                            } else {
                                                let img = new Image();
                                                img.src = URL.createObjectURL(
                                                    files[0]
                                                );
                                                img.onload = () => {
                                                    if (
                                                        img.width /
                                                            img.height !==
                                                        this.props.ratio
                                                    ) {
                                                        if (
                                                            this.props
                                                                .ratioError
                                                        ) {
                                                            this.props.ratioError(
                                                                img.width,
                                                                img.height
                                                            );
                                                            return;
                                                        } else {
                                                            return;
                                                        }
                                                    } else {
                                                        if (
                                                            this.props
                                                                .controllableMultiple ===
                                                            true
                                                        ) {
                                                            setFieldValue(
                                                                name as string,
                                                                value.concat(
                                                                    newFileList
                                                                )
                                                            );
                                                        } else {
                                                            setFieldValue(
                                                                name as string,
                                                                newFileList
                                                            );
                                                        }
                                                    }
                                                };
                                            }
                                        }
                                        debugger;
                                    }
                                }}
                                className={`custom-multi-file-input ${
                                    this.props.multiFileInputClass || ''
                                }`}
                                draggable={true}
                                onDragEnter={(e) => {
                                    this.setState({
                                        dragClassName: 'bordered-dark',
                                    });
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
                            {this.props.multiple === true ||
                            this.props.controllableMultiple === true ? (
                                <>
                                    {value.length && this.props.provider ? (
                                        <>
                                            {this.props.provider({
                                                fieldName: this.props
                                                    .name as string,
                                                values: value,
                                                files: this.fileItemsProvider([
                                                    ...value,
                                                ]),
                                                setFieldValue: setFieldValue,
                                                removeFunction: this
                                                    .remvoveItem,
                                                sortFunction: this.sortItems,
                                            })}
                                            <label
                                                className={`custom-multi-file-label ${
                                                    this.state.dragClassName
                                                } ${
                                                    this.props
                                                        .multiFileLabelClass ||
                                                    ''
                                                }`}
                                                htmlFor={this.id}
                                            >
                                                {this.props.labelContent}
                                            </label>
                                        </>
                                    ) : (
                                        <label
                                            className={`custom-multi-file-label ${
                                                this.state.dragClassName
                                            } ${
                                                this.props
                                                    .multiFileLabelClass || ''
                                            }`}
                                            htmlFor={this.id}
                                        >
                                            {this.props.labelContent}
                                        </label>
                                    )}
                                </>
                            ) : (
                                <>
                                    {value.length && this.props.provider ? (
                                        <>
                                            {this.props.provider({
                                                fieldName: this.props
                                                    .name as string,
                                                values: value,
                                                files: this.fileItemsProvider([
                                                    ...value,
                                                ]),
                                                setFieldValue: setFieldValue,
                                                removeFunction: this
                                                    .remvoveItem,
                                                sortFunction: this.sortItems,
                                            })}
                                        </>
                                    ) : (
                                        <label
                                            className={`custom-multi-file-label ${
                                                this.state.dragClassName
                                            } ${
                                                this.props
                                                    .multiFileLabelClass || ''
                                            }`}
                                            htmlFor={this.id}
                                        >
                                            {this.props.labelContent}
                                        </label>
                                    )}
                                </>
                            )}
                        </div>
                    );
                }}
            </Field>
        );
    }
}
