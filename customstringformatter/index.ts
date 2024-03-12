import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class customstringformatter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _value: string;
    private _productType: number;
    private _fieldName: string;
    private _patternLength: number;
    private _tempRegx: string;
    private _patternType: string;
    private _regxPattern: string[];

    private _regEx : RegExp | null =null;

    // PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
    private _notifyOutputChanged: () => void;
    private labelElement: HTMLLabelElement;

    // input element that is used to create the custom string format
    private inputElement: HTMLInputElement;
    private _container: HTMLDivElement;

    // Reference to ComponentFramework Context object
    private _context: ComponentFramework.Context<IInputs>;    
   
    private _inputHandler: EventListenerOrEventListenerObject;
    private _blurHandler: EventListenerOrEventListenerObject;
    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        debugger;
        this._context = context;
        this._container = document.createElement("div");
        this._notifyOutputChanged = notifyOutputChanged;
        this._blurHandler = this.blurHandeler.bind(this);
        this._inputHandler = this.inputHandeler.bind(this);

        this.inputElement = document.createElement("input");
        this.inputElement.setAttribute("type","text");
        this.inputElement.setAttribute("placeholder","-----");
        this.inputElement.addEventListener("blur",this._blurHandler);
        this.inputElement.addEventListener("input",this._inputHandler);

        this._value = context.parameters.formattedField.raw!;
        this._productType = context.parameters.productType.raw!;
        this._fieldName = context.parameters.formattedField.attributes?.LogicalName!;

        if(this._productType!=17180002)
        {
            if(context.parameters.regExp1!=null)
            {
                this._tempRegx = context.parameters.regExp1.raw!;
                this._regxPattern = this._tempRegx.split("|",3);
                this._tempRegx = this._regxPattern[0];
                this._patternType = this._regxPattern[1];
                this._patternLength = Number(this._regxPattern[2]);
                this._regEx = RegExp(this._tempRegx);
            }
        }
        else
        {
            if(context.parameters.regExp2!=null)
            {
                this._tempRegx = context.parameters.regExp2.raw!;
                this._regxPattern = this._tempRegx.split("|",3);
                this._tempRegx = this._regxPattern[0];
                this._patternType = this._regxPattern[1];
                this._patternLength = Number(this._regxPattern[2]);
                this._regEx = RegExp(this._tempRegx);
            }
        }
        debugger;
        var currentValue = context.parameters.formattedField.formatted ? context.parameters.formattedField.formatted : "----";
        this.labelElement = document.createElement("label");
        this._container.appendChild(this.inputElement);
        this._container.appendChild(this.labelElement);
        container.appendChild(this._container);


    }

    public blurHandeler(evt: Event): void {
        debugger;
        var tempValue = (this.inputElement.value as any) as string;
    }

    public inputHandeler(evt: Event): void {
        debugger;
        var tempValue = (this.inputElement.value as any) as string;
        if(tempValue.length <= this._patternLength)
        {
            this._notifyOutputChanged();
            tempValue = tempValue.replace(/-/gi,"");
            tempValue = tempValue.replace(this._regEx!,this._patternType);
            this._value = tempValue.replace(/-$|--$/gi,"");
            this.inputElement.value = this._value.toUpperCase();
            this.inputElement.setAttribute(this._fieldName,this._value?this._value:"");
        }
        else
        {
            this._notifyOutputChanged();
            this._value=tempValue.substring(0,tempValue.length-1);
            this.inputElement.value=this._value.toUpperCase();
            this.inputElement.setAttribute(this._fieldName,this._value?this._value:"");
        }
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        this._context = context;
        
        this._fieldName = context.parameters.formattedField.attributes?.LogicalName!;
        if(context.parameters.productType.raw! != this._productType)
        {
            this._productType = context.parameters.productType.raw!;
            if(this._productType!=17180002)
            {
                if(context.parameters.regExp1!=null)
                {
                    this._tempRegx = context.parameters.regExp1.raw!;
                    this._regxPattern = this._tempRegx.split("|",3);
                    this._tempRegx = this._regxPattern[0];
                    this._patternType = this._regxPattern[1];
                    this._patternLength = Number(this._regxPattern[2]);
                    this._regEx = RegExp(this._tempRegx);
                }
            }
            else
            {
                if(context.parameters.regExp2!=null)
                {
                    this._tempRegx = context.parameters.regExp2.raw!;
                    this._regxPattern = this._tempRegx.split("|",3);
                    this._tempRegx = this._regxPattern[0];
                    this._patternType = this._regxPattern[1];
                    this._patternLength = Number(this._regxPattern[2]);
                    this._regEx = RegExp(this._tempRegx);
                }
            }
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return { formattedField : this._value};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
        this.inputElement.removeEventListener("input",this._inputHandler);
        this.inputElement.removeEventListener("blur",this._blurHandler);
    }
}
