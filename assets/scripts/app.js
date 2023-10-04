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

}
}

class Tooltip {

}

class ProjectItem {
    constructor(id, updateProjectListFunction) {
        this.id = id;
        this.updateProjectListHandler = updateProjectListFunction;
        this.connectMoreInfoButton();
        this. connectSwitchButton();
    }

    connectMoreInfoButton() {

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
    }
}

App.init();