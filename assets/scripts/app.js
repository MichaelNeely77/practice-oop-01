class DOMHelper {

    static clearEventListeners(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
    static moveElement(elementId, newDestinationSelector) {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
        element.scrollIntoView({behavior: 'smooth'});

    }
}

class Component {
    constructor(hostElementId, insertBefore = false) {
    if(hostElementId) {
        this.hostElement = document.getElementById(hostElementId);
    } else {
        this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
}
    detach () {
        if (this.element) {
            this.element.remove();
        }

        // this.element.parentElement.removeChild(this.element); - Would work in older browsers
    }
    attach() {

       this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element);
    }
}

class ToolTip extends Component {
    constructor(closeNotifierFunction, text, hostElementId) {
        super(hostElementId);
        this.closeNotifier = closeNotifierFunction;
        this.text = text
        this.create();
    }
    closeToolTip = () =>  {
    this.detach();
    this.closeNotifier();
    }

    create() {
        const toolTipElement = document.createElement('div');
        toolTipElement.className = 'card';
        const tooltipTemplate = document.getElementById('tooltip');
        const tooltipBody = document.importNode(tooltipTemplate.content, true);
        tooltipBody.querySelector('p').textContent = this.text;
        toolTipElement.append(tooltipBody);

        const hostElPosLeft = this.hostElement.offsetLeft;
        const hostElPosTop = this.hostElement.offsetTop;
        const hostElPosHeight = this.hostElement.clientHeight;
        const parentElScrolling = this.hostElement.parentElement.scrollTop;

        const x = hostElPosLeft + 20;
        const y = hostElPosTop + hostElPosHeight -parentElScrolling - 10;

        toolTipElement.style.position = 'absolute';
        toolTipElement.style.left = x  + 'px';
        toolTipElement.style.top = y  + 'px';

        toolTipElement.addEventListener('click', this.closeToolTip);
        this.element = toolTipElement;
    }
}



class ProjectItem {
    hasActiveToolTip = false;
    constructor(id, updateProjectListFunction) {
        this.id = id;
        this.updateProjectListHandler = updateProjectListFunction;
        this.connectMoreInfoButton();
        this. connectSwitchButton();
    }

    showMoreInfoHandler() {
        if (this.hasActiveToolTip) {
            return;
        }
        const projectElement = document.getElementById(this.id);
        const tooltipText = projectElement.dataset.extraInfo;
        const tooltip = new ToolTip(() => {
            this.hasActiveToolTip = false;
        }, tooltipText, this.id);
        tooltip.attach();
        this.hasActiveToolTip = true;
    }

    connectMoreInfoButton() {
        const projectItemElement = document.getElementById(this.id);
        const moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler.bind(this));

    }

    connectSwitchButton(type) {
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn);
        switchBtn.textcontent = type === 'active' ? 'Finish' : 'Activate';
        switchBtn.addEventListener('click', this.updateProjectListHandler.bind(null, this.id));
    }

    update(updateProjectsListFn, type) {
        this.updateProjectListHandler = updateProjectsListFn;
        this.connectSwitchButton();

    }
}

class ProjectList {
    projects = [];
    constructor(type) {
        this.type = type;

        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        for(const prjItem of prjItems) {
            this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this), this.type));
        }
        console.log(this.projects);
    }

    setSwitchHandler(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this));
    }

    switchProject(projectId) {
        // const projectIndex = this.projects.findIndex(p => p.id === projectId);
        // this.projects.splice(projectLIst, 1);

        this.switchHandler(this.projects.find(p => p.id === projectId))
        this.projects = this.projects.filter(p => p.id !== projectId);
    }
}

class App {
    static init() {
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwitchHandler(finishedProjectList.addProject.bind(finishedProjectList));
        finishedProjectList.setSwitchHandler(activeProjectList.addProject.bind(activeProjectList));

        // const someScript = document.createElement('script');
        // someScript.textContent = 'alert("Hi there");';
        // document.head.append(someScript);

        // this.startAnaltyics();

        // document.getElementById('start-analytics-btn').addEventListener('click', this.startAnalytics);

        const timerId = setTimeout(this.startAnalytics, 3000);

        document.getElementById('stop-analytics-btn').addEventListener('click',() => { clearTimeout(timerId);
        });
    }


    static startAnalytics() {
        const analyticsScript = document.createElement('script');
        analyticsScript.src = 'assets/scripts/analytics.js';
        analyticsScript.defer = true;
        document.head.append(analyticsScript);
    }

}

App.init();