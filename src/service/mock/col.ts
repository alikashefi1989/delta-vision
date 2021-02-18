export interface ISampleStorage {
    title: string;
    keyName: string;
    body: Object; // {};
    additionalProps: { [key: string]: any };
}
