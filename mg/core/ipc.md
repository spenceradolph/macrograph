MacroGraph IPC API

# Requests

### **app:**

| Destination | Name    | Args |
| ----------- | ------- | ---- |
| Core        | uiReady |      |

### **engines:**

| Destination | Name | Args               |
| ----------- | ---- | ------------------ |
| Core        | all  | SerializedEngine[] |

### **enums:**

| Destination | Name | Args   |
| ----------- | ---- | ------ |
| Core        | all  | SerializedEnum[] |

### **packages:**

| Destination | Name       | Args              | Returns             |
| ----------- | ---------- | ----------------- | ------------------- |
| App         | register   | SerializedPackage |
| Core        | registered |                   | SerializedPackage[] |

### **project:**

| Destination | Name               | Args                                                                                                                            | Returns        |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Core        | createNode         | <code>position: XYCoords;<br>pkg: string; <br>name: string;</pre>                                                               | SerializedNode |
| Core        | connectPins        | <code>from: {<br>&nbsp; node: number;<br> &nbsp; pin: string;<br>}<br>to: {<br>&nbsp; node: number;<br>&nbsp; pin: string;<br>} |
| Core        | deleteNode         | number                                                                                                                          |                |
| Core        | disconnectPin      | <code>node: number;<br>pin: string;                                                                                             |
| Core        | setNodePosition    | <code>id: number;<br>position: XYCoords                                                                                         |
| Core        | setUnconnectedData | <code>node: number;<br>pin: string;<br>data: string \| number \| boolean                                                        |

# Events

### **engines:∗:properties:∗:**

|           Source |    Name    | Args     |
| ---------------: | :--------: | :------- |
| **Select Input** |
|         Core/App |  setValue  | string   |
|             Core | setOptions | string[] |
|   **Text Input** |
|         Core/App |  setValue  | string   |
